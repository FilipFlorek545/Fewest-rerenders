import FormInput from "./Input";
import {useCallback, useRef, useState} from "react";
import {initial} from "../initialValues";
import newValidateForms from "../helpers/validate";
import {Spinner} from "./Spinner";
import validateForms from "../helpers/validate";

const InputForm = (props) => {
    console.log('RENDER')
    const inputs = props.inputs
    const formValues = useRef(initial(inputs))
    const prevChecker = useRef(initial(inputs))
    const [isError, setIsError] = useState({})
    const [notFilled, setNotFilled] = useState(false)
    const working = useRef(false)
    let disabledRef = useRef(true)
    let timer = useRef({});
    const debounce = (func, timeout = 750) => {
        return (...args) => {
            working.current = true
            let name = args[0].target.name
            clearTimeout(timer.current[name])
            timer.current[name] = setTimeout(() => {
                func.apply(this, args);
            }, timeout)
        }
    }

    const delay = ms => new Promise(res => setTimeout(res, ms))

    let inputValues = {}
    inputs.map((t, index) => {
        return(
            inputValues[t.name.toLowerCase()] = t
        )
    })
    const handleInputChange = useCallback(debounce((e) => {
        const name = e.target.name
        const type = inputValues[name].type
        working.current = false
         let checker = validateForms[type](e.target.value, inputValues[name]) || ''
         if(checker !== prevChecker.current[name]){
            setIsError (q => ({
                ...q,
                [name]: checker
            }))
         }
         prevChecker.current[name] = checker
    }), [setIsError]);
    const handleInputBlur = (e) => {
        const {name, value} = e.target;
        formValues.current[name] = value
    }
    const clearInputs = (e) => {
        const initialValues = initial(inputs);
        for(const key in formValues.current){
            formValues.current[key] = initialValues[key];
            //stop debounce
            clearTimeout(timer.current[key])
            //e.target => form
            e.target.reset()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let requiredFields = {...formValues.current}
        let n = Object.values(inputs)
        for(let i = 0; i < n.length; i++){
            if(!(n[i].isRequired)){
                let deletable = n[i].name.toLowerCase()
                delete requiredFields[deletable]
            }
        }
            if(!working.current){
                let disabled = Object.values(requiredFields).some(field => field === '')
                if(disabled){
                    setNotFilled(true)
                    setTimeout(() => setNotFilled(false), 1000)
                }
                let isErrorDisabled = Object.values(isError).some(field => field.length > 0)
                disabledRef.current = disabled || isErrorDisabled
                if(disabledRef.current) return
                //do something with the values
                console.log(JSON.stringify(formValues.current, null, 2))
                clearInputs(e)
                setIsError({});
            }
    }
    return (
        <form autoComplete='new-password' onSubmit={handleSubmit}>
            {inputs.map((e,index) => {
                        return(
                            <FormInput key={index}
                                       label={e.label ?? e.name}
                                       name={e.name}
                                       className={notFilled ? 'not-filled' : ''}
                                       onChange={handleInputChange}
                                       inputType={e.type}
                                       onBlur={handleInputBlur}
                                       validator={isError}
                                       isEmail={e.isEmail ?? false}
                                       isString={e.isString ?? false}
                                       isNumber={e.isNumber ?? false}
                                       isPassword={e.isPassword ?? false}
                                       isRequired={e.isRequired}
                                       length={e.length}
                                       values={e.values ?? null}
                            />
                            //              ^
                            //          fix |
                            //              | swap to props.children
                        )
            })}
            <input disabled={working.current} className="submit" type="submit" value={props.message} />
        </form>
    )
}
export default InputForm
