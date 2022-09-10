// ----- Selector -----
const form : HTMLElement | null = document.querySelector('#new-employee-form');        // selects the first input element
const input = document.querySelector('#new-employee-input') as HTMLInputElement;
const list_element = document.querySelector('#employees');
const header = document.querySelector('header');
const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown');

// ----- Event Listeners -----
document.addEventListener('DOMContentLoaded', getLocalName);        // get back all local storage when dom content loaded

if (form) { 
    form.addEventListener('submit', addNew); 
}


if (list_element) {
    list_element.addEventListener('click', editNDelete);
}

// dropdown menu event listener
dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select')as HTMLElement;
    const icon = dropdown.querySelector('.icon')as HTMLElement;
    const menu = dropdown.querySelector('.menu') as HTMLElement;
    const options = dropdown.querySelectorAll<HTMLElement>('.menu li');
    const selected = dropdown.querySelector('.selected') as HTMLElement;

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');  //add clicked select style to the select element
        icon.classList.toggle('icon-rotate');      // add rotate style to icon
        menu.classList.toggle('menu-open');        // add open style to menu
    });

    options.forEach(option => {
        option.addEventListener('click',()=>{
            selected.innerText = option.innerText;      // change the inner text to clicked option's inner text
            select.classList.remove('select-clicked');  // remove the clicked select style
            icon.classList.remove('icon-rotate');      // remove rotate style to icon
            menu.classList.remove('menu-open');         // remove open style to the menu
            
            options.forEach(option => {
                option.classList.remove('active');      // remove active class from all options
            });

            option.classList.add('active');             // add active style to this clicked option
        });
    });
})


// ----- Functions -----

// create element and add to class
function createElWithClass(newEl:string, newClass:string) {
    const current = document.createElement(newEl)
    current.classList.add(newClass)
    return current
}


// get the input value and add a new employee
function addNew(e: Event) {
    e.preventDefault();         // stop from refresh the page

    const employee : string | null = input.value;

    if (!header) {
        console.log('cannot found header');
        return;
    }

    if (!employee) {
        const incorrectSub = document.createElement('p')
        incorrectSub.textContent = 'Please insert the employee name'
        incorrectSub.style.color = '#E74C3C';
        header.appendChild(incorrectSub);

        // disappear after 2s
        setTimeout(function(){
            header.removeChild(incorrectSub);
        }, 2000);
        return;
    }

    const employee_element = createElWithClass('div', 'employee');

    const employee_content = createElWithClass('div', 'content');

    const employee_input = <HTMLInputElement> createElWithClass('input', 'text');
    employee_input.type = 'text';
    employee_input.value = employee;
    employee_input.setAttribute('readonly', 'readonly');

    const employee_action = createElWithClass('div', 'actions');

    const employee_edit = createElWithClass('button', 'edit');
    employee_edit.innerHTML = 'Edit';

    const employee_delete = createElWithClass('button', 'delete');
    employee_delete.innerHTML = 'Delete';

    employee_content.appendChild(employee_input);

    employee_action.appendChild(employee_edit);
    employee_action.appendChild(employee_delete);
    
    employee_element.appendChild(employee_content);
    employee_element.appendChild(employee_action);
    
    if (!list_element) {
        console.log('cannot found list element');
        return;
    } else {
        list_element.appendChild(employee_element);
    }

    saveLocalName(employee);

    input.value = '';       // clean the value after append
}


function removeLocalName(element: HTMLElement){
    console.log("removelocal:" + element);
    const employee_input = <HTMLInputElement>element.querySelector('.text');
    const  nameIndex = employee_input.value;
    // console.log("text:" + employee_input.value);
    // let names: string[] = [];       // list of input text
    // console.log(typeof(names));
    // console.log("names: " + names);

    // const local_name = localStorage.getItem('names');
    // console.log(typeof(local_name));
    // console.log("local_name: " + local_name);

    // if (local_name === null) {
    //     names = [];         // if doesn't exist, create empty list
    // } else {
    //     names = JSON.parse(local_name);
    // }

    // const nameIndex = <HTMLElement>element.children[0].innerText;
    // names.splice(names.indexOf(nameIndex), 1);
    // localStorage.setItem("names", JSON.stringify(names));
}


// edit employee name or delete the employee
function editNDelete(e:Event){
    console.log(e.target);
    const item = <HTMLElement> e.target;
    const employee_action = <HTMLElement>item.parentElement;
    const employee_element = <HTMLElement>employee_action.parentElement;

    if (item.classList[0] === 'delete') {  
        console.log("in delete");
        if(confirm('Are you sure to kick this person out?')){
            console.log("employee_element: " + employee_element.className);
            employee_element.classList.toggle('employee-fall');      // add animation
            console.log("employee_element: " + employee_element.className);
            employee_element.addEventListener('transitionend', function(){
                removeLocalName(employee_element);
                employee_element.remove();      // remove after transition end
            })
            
        }
    }

    if (item.classList[0] === 'edit') {  
        const employee_input = <HTMLInputElement>employee_element.querySelector('.text');
        if (employee_input.readOnly) {
            employee_input.removeAttribute('readonly');
            employee_input.focus();
            item.innerText = 'Save';
        } else {
            console.log ('Save');
            employee_input.setAttribute('readonly', 'readonly');
            item.innerText = 'Edit';
        }
    }
}

// save input to local storage
function saveLocalName(newName: string){
    console.log("save Local Name here");
    let names: string[] = [];       // array of input text
    
    const local_name = localStorage.getItem('names');
    
    if(local_name !== null){
        // console.log(typeof(local_name));
        // console.log("local_name: " + local_name);

        names = JSON.parse(local_name);     // make sure it's not null
        // console.log(typeof(names));
        // console.log(names);
    } else {
        // console.log("local name is empty");
        names = [];         // if doesn't exist, create empty list
    }
    names.push(newName);
    localStorage.setItem('names', JSON.stringify(names));         // set back to local storage
}

// get local storage name and recreate the UI
function getLocalName(){
    let names: string[] = [];       // list of input text
    // console.log(typeof(names));
    // console.log("names: " + names);

    const local_name = localStorage.getItem('names');
    // console.log(typeof(local_name));
    // console.log("local_name: " + local_name);

    if(local_name === null){
        names = [];         // if doesn't exist, create empty list
    } else {
        // const local_name = localStorage.getItem('names');
        // if (local_name){
            names = JSON.parse(local_name);     // make sure it's not null and get it back
            // BUG TO FIX: names is string instead of array
        // }
    }
    console.log(typeof(names));
    console.log("names in get" + names);

    for (let name of names) {       // replaced forEach
        const employee_element = createElWithClass('div', 'employee');
        const employee_content = createElWithClass('div', 'content');
        
        const employee_input = <HTMLInputElement> createElWithClass('input', 'text');
        employee_input.type = 'text';
        employee_input.value = name;
        employee_input.setAttribute('readonly', 'readonly');

        const employee_action = createElWithClass('div', 'actions');

        const employee_edit = createElWithClass('button', 'edit');
        employee_edit.innerHTML = 'Edit';

        const employee_delete = createElWithClass('button', 'delete');
        employee_delete.innerHTML = 'Delete';

        employee_content.appendChild(employee_input);

        employee_action.appendChild(employee_edit);
        employee_action.appendChild(employee_delete);
        
        employee_element.appendChild(employee_content);
        employee_element.appendChild(employee_action);

    
        if (!list_element) {
            console.log('cannot found list element');
            return;
        } else {
            list_element.appendChild(employee_element);
        }
    }
}