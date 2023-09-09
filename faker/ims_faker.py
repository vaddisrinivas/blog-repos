from faker import Faker
import random
import json
fake = Faker()
from faker_vehicle import VehicleProvider
fake.add_provider(VehicleProvider)


def generate_supplier():
    supplier = {
        "_id": fake.uuid4(),
        "name": fake.company(),
        "description": fake.sentence(),
        "contact_name": fake.name(),
        "contact_email": fake.email(),
        "contact_phone": fake.phone_number(),
        "address": fake.address(),
         "last_updated": fake.iso8601(),

    }
    return supplier

def generate_product():
    product = {
        "_id": fake.uuid4(),
        "name": fake.vehicle_make_model(),
        "description": fake.vehicle_year_make_model(),
        "last_updated": fake.iso8601(),
        "created_by": fake.email(),
        "related_subproducts": [],
        "image": "http://myimage.com"
    }
    return product

def generate_shipment(supplier_id, product_id, order_id):
    shipment = {
        "_id": fake.uuid4(),
        "name": fake.machine_make_model(),
        "description": fake.machine_year_make_model_cat(),
        "last_updated": fake.iso8601(),
        "status": random.choice(["pending", "shipped", "delivered", "returned"]),
        "related_supplier_id": supplier_id,
        "related_product_id": product_id,
        "order_id": order_id,
        "units": random.randint(1, 100),
        "priority": random.randint(1, 10),
        "created_by": fake.email(),
        "location": fake.address()

    }
    return shipment

def generate_order(shipments):
    order = {
        "_id": fake.uuid4(),
        "name": fake.catch_phrase(),
        "description": fake.sentence(),
        "last_updated": fake.iso8601(),
        "status": random.choice(["pending", "processing", "completed", "cancelled"]),
        "related_shipments": shipments,
        "priority": random.randint(1, 10),
        "created_by": fake.email()
    }
    return order

def generate_inventory_unit(product_id,shipment_id,order_id):
    inventory_unit = {
        "_id": fake.uuid4(),
        "name": fake.word(),
        "description": fake.sentence(),
        "related_product_id": product_id,
        "units_current": random.randint(0, 100),
        "units_required": random.randint(0, 100),
        "units_safe": random.randint(0, 100),
        "updated_date": fake.iso8601(),
        "created_date": fake.iso8601(),
        "serial_number": fake.uuid4(),
        "related_shipment_id": shipment_id,
        "related_order_id": order_id,
        "bar_code": fake.ean13(),
        "status": random.choice(["available", "reserved", "out of stock", "damaged"]),
        "lot_number": fake.uuid4(),
        "shelf_numbers": [fake.random_number(digits=3) for _ in range(random.randint(1, 3))]
    }
    return inventory_unit


def save_to_json(data, filename):
    with open(filename, "w") as jsonfile:
        json.dump(data, jsonfile, indent=4)

# Generate suppliers
num_suppliers = 50
suppliers = [generate_supplier() for _ in range(num_suppliers)]
save_to_json(suppliers, "mock_suppliers.json")

# Generate products
num_products = 150
products = [generate_product() for _ in range(num_products)]
save_to_json(products, "mock_products.json")

# Generate orders using shipments
num_orders = 100
orders = [generate_order([]) for i in range(20)]

# Generate shipments and inventory units
shipments = []
inventory_units = []
num_shipments = 2000
num_inventory = 10000

for i in range(num_shipments):
    product_shipment = generate_shipment(random.choice(suppliers)["_id"], random.choice(products)["_id"], random.choice(orders)["_id"])
    shipments.append(product_shipment)
for i in shipments:
    for j in orders:
        if i["order_id"]==j["_id"]:
            j["related_shipments"].append(i["_id"])
        
for i in range(num_inventory):
    product_inventory = generate_inventory_unit(random.choice(suppliers)["_id"], random.choice(products)["_id"], random.choice(orders)["_id"])
    inventory_units.append(product_inventory)



# Save shipments and inventory units
save_to_json(shipments, "mock_shipments.json")
save_to_json(inventory_units, "mock_inventory_units.json")
save_to_json(orders, "mock_orders.json")

print("Mock data saved to json files.")


# current stock
# safety stock
# in transit shipments
# inspection results
# supplier pie chart