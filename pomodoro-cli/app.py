import argparse
import os
import time
import json
import configparser
from tqdm import tqdm
from colorama import Fore, Style
import pyfiglet

# Initialize colorama
import colorama
colorama.init()

# Parse command line arguments
parser = argparse.ArgumentParser(description="Pomodoro Timer App")
parser.add_argument(
    "-c", "--config", default=os.getenv("POMODORO_CONFIG", "pomodoro.ini"), help="Path to the configuration file (default: pomodoro.ini)"
)
parser.add_argument(
    "-b", "--backup", default=os.getenv("POMODORO_BACKUP"), help="Path to the backup file"
)
args = parser.parse_args()

# Initialize configuration
config = configparser.ConfigParser()

# Read backup file path from config file or environment variable
backup_file = args.backup or (config.read(args.config) and config.get("DEFAULT", "POMODORO_BACKUP", fallback=None))

# Function to load configuration from backup file
def load_backup():
    if backup_file and os.path.exists(backup_file):
        with open(backup_file, 'r') as f:
            return json.load(f)
    return None

# Function to save interaction to backup file
def save_backup(interaction):
    if backup_file:
        interactions = load_backup() or []
        interactions.append(interaction)
        with open(backup_file, 'w') as f:
            json.dump(interactions, f, indent=4)

# Function to prompt user for custom time input
def get_custom_time():
    while True:
        try:
            minutes = int(input(Fore.CYAN + "Enter the time in minutes (up to 60): " + Style.RESET_ALL))
            if 0 < minutes <= 60:
                return minutes
            else:
                print(Fore.RED + "Please enter a valid time between 1 and 60 minutes." + Style.RESET_ALL)
        except ValueError:
            print(Fore.RED + "Please enter a valid number." + Style.RESET_ALL)

# Check if config file exists, if not create one with default values
if not os.path.exists(args.config):
    config["DEFAULT"] = {
        "POMODORO_TIME": "25",
        "SHORT_BREAK": "5",
        "LONG_BREAK": "15",
        "POMODORO_BACKUP": "pomodoro_backup.json"
    }
    with open(args.config, 'w') as configfile:
        config.write(configfile)

# Load configuration
config.read(args.config)
pomodoro_time = int(config["DEFAULT"]["POMODORO_TIME"])
short_break = int(config["DEFAULT"]["SHORT_BREAK"])
long_break = int(config["DEFAULT"]["LONG_BREAK"])

# Load from backup
if not load_backup():
    save_backup({"startup": time.time(), "config": {"POMODORO_TIME": pomodoro_time, "SHORT_BREAK": short_break, "LONG_BREAK": long_break}})

# Define timer tasks
tasks = [
    {"description": "Pomodoro", "duration": pomodoro_time * 60},
    {"description": "Short Break", "duration": short_break * 60},
    {"description": "Pomodoro", "duration": pomodoro_time * 60},
    {"description": "Short Break", "duration": short_break * 60},
    {"description": "Pomodoro", "duration": pomodoro_time * 60},
    {"description": "Short Break", "duration": short_break * 60},
    {"description": "Pomodoro", "duration": pomodoro_time * 60},
    {"description": "Long Break", "duration": long_break * 60},
]

def run_timer(task_index, total_duration):
    with tqdm(total=total_duration, desc=Fore.YELLOW + tasks[task_index]["description"] + Style.RESET_ALL) as pbar:
        while pbar.n < pbar.total:
            remaining_time_art = pyfiglet.figlet_format(time.strftime("%M:%S", time.gmtime(pbar.total - pbar.n)), font="slant")
            # flush console output
            print("\033c", end="")
            tqdm.write(Fore.CYAN + remaining_time_art + Style.RESET_ALL, end="\r")
            pbar.update(1)
            time.sleep(1)

            # Save interaction
            current_time = time.time()
            interaction = {
                "time": current_time,
                "timer": tasks[task_index]["description"],
                "current_time": current_time,
                "remaining_time": pbar.total - pbar.n
            }
            save_backup(interaction)

            # Save backup after every iteration
            if pbar.n % 60 == 0:  # Save backup every minute (adjust as needed)
                save_backup(interaction)

# Display title
title_art = pyfiglet.figlet_format("Pomo-Granide")
print(Fore.GREEN + title_art + Style.RESET_ALL)

# Display options
print(Fore.GREEN + "Options:")
print("1. Pomodoro (" + str(pomodoro_time) + " minutes)")
print("2. Short Break (" + str(short_break) + " minutes)")
print("3. Long Break (" + str(long_break) + " minutes)")

# Add additional options up to 1 hour (every 5 minutes)
for i in range(4, 13):
    option_time = i * 5
    print(f"{i}. {option_time} Minutes")

print(Style.RESET_ALL)

# Prompt user to set the timer
selected_option = "1"

if selected_option in ("1", "2", "3"):
    task_index = int(selected_option) - 1
    total_duration = tasks[task_index]["duration"]

    # Run the timer
    run_timer(task_index, total_duration)

elif selected_option in (str(i) for i in range(4, 13)):
    custom_time = int(selected_option) * 5
    task_index = len(tasks)  # Add the custom task at the end
    total_duration = custom_time * 60
    tasks.append({"description": f"{custom_time} Minutes", "duration": total_duration})

    # Run the timer
    run_timer(task_index, total_duration)

else:
    print(Fore.RED + "Invalid option selected. Exiting..." + Style.RESET_ALL)
