import '../Input.css'
const FormInput = (props) => {
    let name = (props.name).toLowerCase()
    let required
    let type
    const customTypes = {
        name: 'text',
    }
    customTypes.hasOwnProperty(props.inputType) ? type = customTypes[props.inputType] : type = props.inputType
    props.isRequired ? required = 'Required' : required = ''
    if(type !== 'radio'){
        return(
            <>
                <label>{props.label + ":"}<br/><p>{required}</p> </label>
                <div className='input-wrapper'>
                    <input
                        type={type}
                        name={name}
                        className={props.isRequired ? props.className : ''}
                        data-input-type={props.inputType}
                        data-input-label={props.label}
                        data-input-required={props.isRequired}
                        aria-label={name}
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        autoComplete="new-password"
                    />
                </div>
                <p className='err-msg'>{props.validator[name] || ''}</p>
                <br/><br/>
            </>
        )
    }
    else{
        return (
            <>
                <label>{props.label + ":"}<br/><p>{required}</p> </label>
                <div className="radio-wrapper">
                    {props.values.map((val, index) => {
                        return(
                    <div key={index} className='input-wrapper'>
                            <input
                                type={type}
                                name={name}
                                className={props.className}
                                data-input-type={props.inputType}
                                data-input-label={props.label}
                                data-input-required={props.isRequired}
                                aria-label={name}
                                onChange={props.onChange}
                                onBlur={props.onBlur}
                                autoComplete="new-password"
                                value={val}
                            />
                        <label>{val}</label>
                    </div>
                        )})}
                    <p className='err-msg'>{props.validator[name] || ''}</p>
                    <br/><br/>
                </div>
            </>
        )
    }
}
export default FormInput