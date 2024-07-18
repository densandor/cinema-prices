import { useState } from "react";
import "../../pages.css";

const FormInput = (props) => {
	//sets the attribute of someone having visited the form as false
	const [left, setLeft] = useState(false);

	//gets the values passed to the component and assigns them as the input's properties
	const { label, errorMessage, onChange, id, ...inputData } = props;

	//set the left property of the input to true once the user leaves it
	const handleLeave = () => {
		setLeft(true);
	};

	return (
		<div className="formInput">
			<label>{label}</label>
			<input
				autoComplete="off"
				{...inputData}
				onChange={onChange}
				onBlur={handleLeave}
				left={left.toString()}
			/>
			<div className="error">{errorMessage}</div>
		</div>
	);
};

export default FormInput;
