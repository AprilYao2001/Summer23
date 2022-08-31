# In this file we will have reusable functions to interact with the data in the database.
# CRUD: Create, Read, Update, and Delete
# ...although in this example we are only creating and reading

from sqlalchemy.orm import Session
# allow to declare the type of the db parameters and have better type checks and completion in functions

from . import models, schemas

# Read a single user by ID
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# Read a single user by email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Read multiple users
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# Create a SQLAlchemy model instance with data
def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"        # example is not secure, the password is not hashed. In a real life application you would need to hash the password and never save them in plaintext.
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)     # add instance object to database session
    db.commit()         # commit the changes to the database (so that they are saved)
    db.refresh(db_user) # refresh instance (so that it contains any new data from the database, like the generated ID)
    return db_user

# Read multiple items
def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()

# Create a SQLAlchemy model instance with your data.
def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    db_item = models.Item(**item.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# Create a employee record
def insert_employee(db: Session, employee: schemas.EmployeeCreate, dept_id: int, manager_id: int):
    new_employee = models.Employee(**employee.dict(), dept_id = dept_id, manager_id = manager_id)
    db.add(new_employee)        # add instance object to database session
    db.commit()                 # commit the changes to the database (so that they are saved)
    db.refresh(new_employee)    # refresh instance (so that it contains any new data from the database, like the generated ID)
    return new_employee

# Read multiple employees
def select_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

# Read employee by id
def select_employee_by_id(db: Session, emp_id: int):
    return db.query(models.Employee).filter(models.Employee.id == emp_id).first()

#TODO: Read employees by salary range
def select_employee_by_salary(db: Session, higher: int, lower: int = -1):
    return db.query(models.Employee).filter(models.Employee.salary < higher, models.Employee.salary > lower,).all()

# Create a manager record
def insert_manager(db: Session, manager: schemas.ManagerCreate, dept_id: int):
    new_manager = models.Manager(**manager.dict(), dept_id = dept_id)
    db.add(new_manager)        # add instance object to database session
    db.commit()                 # commit the changes to the database (so that they are saved)
    db.refresh(new_manager)    # refresh instance (so that it contains any new data from the database, like the generated ID)
    return new_manager

# Read multiple managers
def select_managers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Manager).offset(skip).limit(limit).all()

# Read manager by id
def select_manager_by_id(db: Session, mng_id: int):
    return db.query(models.Manager).filter(models.Manager.id == mng_id).first()

# Create a department record
def insert_department(db: Session, department: schemas.DepartmentCreate):
    new_department = models.Department(**department.dict())
    db.add(new_department)        # add instance object to database session
    db.commit()                 # commit the changes to the database (so that they are saved)
    db.refresh(new_department)    # refresh instance (so that it contains any new data from the database, like the generated ID)
    return new_department

# Read multiple departments
def select_departments(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Department).offset(skip).limit(limit).all()

# Read department by id
def select_department_by_id(db: Session, dept_id: int):
    return db.query(models.Department).filter(models.Department.id == dept_id).first()