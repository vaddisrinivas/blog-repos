import logging
import threading
import time
import requests

# Configure the logging module to write to a file
logging.basicConfig(filename='download_log.txt', level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class CustomMutex:
    """
    A custom mutex class to control access to a shared resource.
    """

    def __init__(self):
        """
        Initialize the CustomMutex.
        """
        self.locked = False
        self.thread_name = threading.current_thread().name
        self.files = 0

    def lock(self):
        """
        Acquire the mutex lock.

        Avoids the main thread from acquiring locks.
        """
        logging.info(f"Thread {self.thread_name} requesting Mutex lock")

        while self.locked:
            time.sleep(2)
        self.locked = True
        logging.info(f"Thread {self.thread_name} acquired Mutex lock")

    def unlock(self):
        """
        Release the mutex lock.

        Avoids the main thread from releasing locks.
        """
        self.locked = False
        logging.info(f"Thread {self.thread_name} released Mutex lock")

class CustomSemaphore:
    """
    A custom semaphore class for managing permits.
    """

    def __init__(self, permits):
        """
        Initialize the CustomSemaphore with the given number of permits.

        Args:
            permits (int): The initial number of permits.
        """
        self.permits = permits
        self.thread_name = threading.current_thread().name

    def acquire(self):
        """
        Acquire a semaphore permit.

        Avoids the main thread from acquiring permits.
        """
        logging.info(f"Thread {self.thread_name} requesting Semaphore permit")
        start_time = time.time()
        while self.permits <= 0:
            if time.time() - start_time > 10:
                logging.info(f"Thread {self.thread_name} paused for too long")
            time.sleep(2)
        self.permits -= 1
        logging.info(f"Thread {self.thread_name} acquired Semaphore permit. Permits left: {self.permits}")

    def release(self):
        """
        Release a semaphore permit.

        Avoids the main thread from releasing permits.
        """
        self.permits += 1
        logging.info(f"Thread {self.thread_name} released Semaphore permit. Permits left: {self.permits}")

class CustomFileMutex:
    """
    A custom mutex class for file access control.
    """

    def __init__(self):
        """
        Initialize the CustomFileMutex.
        """
        self.locked = False
        self.thread_name = threading.current_thread().name

    def lock(self):
        """
        Acquire the file mutex lock.

        Avoids the main thread from acquiring locks.
        """
        logging.info(f"Thread {self.thread_name} requesting File Mutex lock")
        while self.locked:
            logging.info(f"Thread {self.thread_name} waiting for File Mutex lock")
            time.sleep(2)
        self.locked = True
        logging.info(f"Thread {self.thread_name} acquired File Mutex lock")

    def unlock(self):
        """
        Release the file mutex lock.

        Avoids the main thread from releasing locks.
        """
        self.locked = False
        logging.info(f"Thread {self.thread_name} released File Mutex lock")

def download_chunk(url, mutex, file_mutex, semaphore):
    """
    Download a chunk of data from a URL and write it to a file.

    Args:
        url (str): The URL to download data from.
        mutex (CustomMutex): A mutex for controlling access to the shared resource.
        file_mutex (CustomFileMutex): A mutex for controlling file access.
        semaphore (CustomSemaphore): A semaphore for managing permits.
    """
    thread_name = threading.current_thread().name
    try:
        mutex.lock()
        mutex.files += 1
        filename = f"file-{mutex.files}.zip"
        mutex.unlock()

        semaphore.acquire()
        logging.info(f"Thread {thread_name} downloading: {url}")
        response = requests.get(url)
        logging.info(f"Thread {thread_name} downloaded: {url}")

        file_mutex.lock()
        with open(filename, "ab") as file:
            file.write(response.content)
        logging.info(f"Thread {thread_name} finished: {url}")

    except Exception as e:
        logging.error(f"Thread {thread_name} encountered an error: {str(e)}")

    finally:
        file_mutex.unlock()
        semaphore.release()

def download_files(urls, num_threads):
    """
    Download multiple files from the provided URLs using multiple threads.

    Args:
        urls (list): A list of URLs to download from.
        num_threads (int): The number of threads to use for downloading.
    """
    threads = []
    mutex = CustomMutex()
    file_mutex = CustomFileMutex()
    semaphore = CustomSemaphore((num_threads // 2) + 1)

    for i in range(num_threads):
        url = urls[i]

        thread = threading.Thread(target=download_chunk, args=(url, mutex, file_mutex, semaphore), name=f"Thread-{i}")
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

if __name__ == "__main__":
    urls = [
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/5MB.zip",
        "http://ipv4.download.thinkbroadband.com/10MB.zip",
        # Add more URLs as needed
    ]

    num_threads = len(urls)  # Use the same number of threads as URLs
    download_files(urls, num_threads)
