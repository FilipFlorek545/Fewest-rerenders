
import './App.css'
import InputForm from "./components/Form";
import ErrorMessages from "./components/ErrorMessages";

    //This form is intended to have the lowest amount of re-renders as possible


function App() {
    return (
        <div className="App">
        <InputForm
            inputs = {[
                {name: 'Name', type: 'name', isRequired: true,
                    isString: true, length: ([6,20])},
                {name: 'Email', type: 'email', isRequired: false,
                    isString: true, isEmail: true, msg: ErrorMessages.invalidVal},
                {name: 'Surname', type: 'name', isRequired: true,
                    isString: true, length: ([3,25])},
                {name: 'Password', type: 'password', isRequired: true,
                    length: ([6,20]), isPassword: true},
                {name: 'LastField', type: 'name', label: 'Last Field',
                    isRequired: false, primary: 'setup'},
                {name: 'Checkbox', type: 'radio', label: 'Other option', secondary: 'setup', //tertiary
                    isRequired: true, values: ['Option 1', 'Option 2', 'Option 3']},
            ]}
            message='Send'
        />
        </div>
    )
}

export default App;
