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
    // let disabledRef = useRef(true) //obsolete
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
                    setNotFilled(requiredFields)
                    setTimeout(() => setNotFilled(false), 1000)
                }
                let isErrorDisabled = Object.values(isError).some(field => field.length > 0)
                // disabledRef.current = disabled || isErrorDisabled
                if(disabled || isErrorDisabled) return
                //do something with the values
                console.log(JSON.stringify(formValues.current, null, 2))
                clearInputs(e)
                setIsError({});
            }
    }
    let i = 0;
    return (
        <form autoComplete='new-password' onSubmit={handleSubmit}>
            {inputs.map((e,index) => {
                console.log(inputs)
                        return(
                            <FormInput key={index}
                                       label={e.label ?? e.name}
                                       name={e.name}
                                        {...(notFilled[e.name.toLowerCase()] === '' && {className:'not-filled'})}
                                       onChange={handleInputChange}
                                       inputType={e.type}
                                       onBlur={handleInputBlur}
                                       validator={isError}
                                       {...(e.isEmail && { isEmail: true })}
                                       {...(e.isString && { isString: true })}
                                       {...(e.isNumber && { isNumber: true })}
                                       {...(e.isPassword && { isPassword: true })}
                                       {...(e.isRequired !== undefined && { isRequired: e.isRequired })}
                                       {...(e.length && { length: e.length })}
                                       {...(e.values && { values: e.values })}
                                       {...(e.primary && {primary: e.primary})}
                                       {...(e.secondary && {secondary: e.secondary})}
                            />
                            //              ^
                            //          fix |
                            //              | swap to props.children ??
                        )
            })}
            <input disabled={working.current} className="submit" type="submit" value={props.message} />
        </form>
    )
}
export default InputForm
