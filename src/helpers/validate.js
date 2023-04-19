import ErrorMessages from "../components/ErrorMessages";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const specCharRegex = /[!@#$%&*()_+=|<>?{}\\[\]~-]/g
const defaultMsg = 'Invalid input'
const valModel = function (){} //constructor, can stay empty for now
valModel.prototype = {
    errors:[],
    checkList:{},
    clear() {
      this.checkList = {}
        return this
    },
    required(bool){
        this.checkList.required = bool
        return this
    },
    string(value){
        this.checkList.string = value
        return this
    },
    number(){
        this.checkList.number()
        return this
    },
    length(min, max){
        this.checkList.length = [min, max]
        return this
    },
    email(value){
        this.checkList.email = value
        return this
    },
    password(value){
        this.checkList.password = value
        return this
    },
    check(){
        const list = this.checkList
        if(list.hasOwnProperty('string')) {
            if(list.required && list.string === '') return this.errors = ErrorMessages.empty
        }
        if(list.hasOwnProperty('number')) {
            if(list.required && list.number === '') return this.errors = ErrorMessages.empty
        }
        if(list.hasOwnProperty('length')) {
            if (list.string.length < list.length[0]) return this.errors = ErrorMessages.short
            if (list.string.length > list.length[1]) return this.errors = ErrorMessages.long
        }
        if(list.hasOwnProperty('email')){
            if(!emailRegex.test(list.email) && list.email !== '') return this.errors = ErrorMessages.invalidVal
        }
        if(list.hasOwnProperty('password')){
            if(!specCharRegex.test(list.password) && list.password !== '') return this.errors = ErrorMessages.invalidVal
        }
        return this.errors = ''
    },
    addMethod(name, callback){
         this[name] = callback;
     },
    valueOf(){
        return this.checkList
    }
}

const validateForms = {
    name: (value, input) => valModel.prototype.clear()
        .required(input.isRequired).string(value)
        .length(input.length ? input.length[0] : 0, input.length ? input.length[1] : 100)
        .check(),
    email: (value, input) => valModel.prototype.clear()
        .required(input.isRequired)
        .email(value)
        .check(),
    number:(value, input) => valModel.prototype.clear()
        .required(input.isRequired).number(value)
        .length(input.length ? input.length[0] : 0, input.length ? input.length[1] : 100)
        .check(),
    password:(value, input) => valModel.prototype.clear()
        .required(input.isRequired).string(value).password(value)
        .length(input.length ? input.length[0] : 0, input.length ? input.length[1] : 100)
        .check(),
    text:(value, input) => valModel.prototype.clear()
        .required(input.isRequired)
        .length(input.length ? input.length[0] : 0, input.length ? input.length[1] : 100)
        .check(),
    radio:() => valModel.prototype.check()
}



export default validateForms;

//Try doing so that there will be like 4-5 types of validation,
// and each input will have an attribute ==> DONE
// specified np(30 inputs -> 5 types, ergo 5 types of validation) ==> DONE
// fix the need to add  type = letterToUppercase(type) in each type ==> DONE
// disable the button only when required inputs are touched ==> DONE
// make it so that when the label isn't specified program will use the name ==> DONE
// change switch in Input component to Object, that when key has no matching values will default ==> DONE

// adjust validate.js so it will conform new requirements ==>
// create a new array, that will hold all forms of validation needed, then via valueOf that will contain
// link to a method (np method.name) call it, and return msg

// add loader/spinner ==> DONE, needs fixing
// add possibility of inputs being dependent on other inputs
// add radio and select types
// customizable errors??? ==> being worked on
// fix the debounce delay on submit
// try fixing the constant juggling of the name value (uppercase, lowercase)
//
//


// keep removing bloat