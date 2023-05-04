import { Mentions, ConfigProvider } from 'antd'
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useSelector } from "react-redux";
//  value={currentPrompt}
// className="outline-none text-base border-none focus:ring-0"
// placeholder="Type a message"
// onChange={handlePromptChange}
// onKeyDown={handleKeypressStream}
function PromptInput(props) {
	const { value, onChange, placeholder, onEnter } = props;
	const prompts = useSelector(state => state.prompts);

	const options = prompts.map((prompt) => {
		return {
			value: prompt.content,
			label: prompt.name,
		}
	})
	const [isSelectingPrompt, setIsSelectingPrompt] = React.useState(false);

	const [promptVars, setPromptVars] = React.useState([]);
	const [isPromptModalVisible, setIsPromptModalVisible] = React.useState(false);


	const handlePromptSelect = (option, prefix) => {
		const { value, label } = option;
		const { value: oldValue } = props;

		// Find the last occurrence of prefix in oldValue
		const prefixIndex = oldValue.lastIndexOf(prefix);

		if (prefixIndex !== -1) {
			// Find the first occurrence of space after prefix
			const spaceIndex = oldValue.indexOf(' ', prefixIndex);

			// Replace old value from prefix to space with the selected value
			let newValue;
			if (spaceIndex === -1) {
				// No space found after prefix, replace the rest of the string with value
				newValue = oldValue.slice(0, prefixIndex) + value;
			} else {
				// Replace the substring from prefix to space with value
				newValue =
					oldValue.slice(0, prefixIndex) + value + oldValue.slice(spaceIndex);
			}

			// Call the onChange callback with the new value
			onChange(newValue);
			setIsSelectingPrompt(false)

			// the new value may or may not contain variables in {{}}, now we need to open a modal asking for the values of those variables from the user
			const variablesRegex = /{{([^}]*)}}/g;
			let match;
			const variables = [];

			while ((match = variablesRegex.exec(newValue)) !== null) {
				variables.push(match[1]);
			}

			if (variables.length > 0) {
				const temp = variables.map((variable) => {
					return {
						[variable]: ''
					}
				})
				setPromptVars(temp);
				setIsPromptModalVisible(true);
			}
		}
	};

	// if user is not selecting prompt then handle the keypress event normally else handle it for prompt selection only
	const hadleKeydown = (e) => {
		if (isSelectingPrompt) {
			return
		}
		if (!value || value.trim() == '') { return }
		if (e.keyCode === 13) {
			e.preventDefault()
			return onEnter(e)
		}
	}

	const handleInsertVariableValues = () => {
		const { value: oldValue } = props;

		const newValue = oldValue.replace(
			/{{(\w+)}}/g, // Regular expression to match variable placeholders
			(match, variableName) => {
				// Find the variable value in promptVars array
				const variable = promptVars.find((v) => v[variableName]);
				return variable ? variable[variableName] : match; // Replace placeholder with value or return placeholder
			}
		);

		onChange(newValue);
		setIsPromptModalVisible(false);
		setPromptVars([])
	}

	return (
		<ConfigProvider theme={{
			components: {
				Mentions: {
					colorPrimary: 'rgba(0, 0, 0, 0)',
					colorPrimaryActive: 'rgba(0, 0, 0, 0)',
					colorPrimaryHover: 'rgba(0, 0, 0, 0)',
					controlOutline: 'rgba(0, 0, 0, 0)',
					colorBorder: 'rgba(0, 0, 0, 0)',
				},
			}
		}}>
			<div>
				<CustomMentions
					autoSize={{ maxRows: 8 }}
					className='scrollbar-custom'
					style={{ maxHeight: '400px' }}
					onChange={onChange}
					placeholder={placeholder}
					value={value}
					onSelect={(option, prefix) => handlePromptSelect(option, prefix)}
					options={options}
					filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1}
					prefix="/"
					onKeyDown={(e) => { hadleKeydown(e) }}
					onSearch={() => setIsSelectingPrompt(true)}
					onBlur={() => setIsSelectingPrompt(false)}
				/>
				<Modal
					centered
					closable={false}
					title="Insert Variable Values for Prompt"
					visible={isPromptModalVisible}
					okButtonProps={{ style: { backgroundColor: "#000" } }}
					onOk={() => handleInsertVariableValues()}
					okText="Save"
					onCancel={() => {
						setIsPromptModalVisible(false);
						setPromptVars([])
					}}
				>
					<form className="flex flex-col h-full gap-4" onChange={
						(e) => {
							const { name, value } = e.target;
							const temp = promptVars.map((variable) => {
								const key = Object.keys(variable)[0];
								if (key === name) {
									return {
										[key]: value
									}
								}
								return variable;
							})
							setPromptVars(temp);
						}
					}>
						{promptVars.map((variable, index) => {
							const key = Object.keys(variable)[0];
							return (
								<div key={index} className="flex flex-col gap-2 h-full">
									<label className="font-medium text-gray-700 text-base"
										htmlFor={key}>{key}</label>
									<div className="flex flex-col w-ful gap-2 h-full">
										<textarea
											id={key}
											placeholder="Name of the prompt"
											className="p-2 border border-[#CED0D4] h-full rounded-md bg-transparent "
											type="input" name={key} value={variable[key]}
										/>
									</div>
								</div>
							)
						})}
					</form>
				</Modal>
			</div>
		</ConfigProvider>
	)
}

export default PromptInput







{/* <Mentions
autoSize={{ maxRows: 8 }}
className='scrollbar-custom'
style={{ maxHeight: '400px' }}
onChange={onChange}
placeholder={placeholder}
value={value}
onSelect={(option, prefix) => handlePromptSelect(option, prefix)}
options={options}
filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1}
prefix="/"
onKeyDown={(e) => { hadleKeydown(e) }}
onSearch={() => setIsSelectingPrompt(true)}
onBlur={() => setIsSelectingPrompt(false)}
/> */}

// to make a custom mention component we need to use the following props
// 1. prefix - the prefix that will be used to trigger the mention
// 2. onSearch - this will be called when the user types the prefix and the mention is triggered
// 3. onSelect - this will be called when the user selects a mention from the dropdown
// 4. filterOption - this will be called to filter the options based on the user input
// 5. options - this is the array of options that will be shown in the dropdown
// 6. value - the value of the input field

const CustomMentions = (props) => {
	const { options, onChange, onSearch, onSelect } = props;
	const [showPromptsList, setShowPromptsList] = useState(false);
	const [promptsList, setPromptsList] = useState(options)
	const [searchText, setSearchText] = useState('')
	const [activePromptIndex, setActivePromptIndex] = useState(0)


	const list = useRef(null); // add this line to create a ref

	const handlePrefixKeyDown = (e) => {
		if (e.key === '/' && !showPromptsList) {
			setShowPromptsList(true);
			alert('showing prompts list' + showPromptsList)
		}
		if (showPromptsList) {
			if (e.key === 'ArrowDown' && activePromptIndex < promptsList.length - 1) {
				setActivePromptIndex(activePromptIndex + 1);
				// updateListScroll();
			}
			if (e.key === 'ArrowUp' && activePromptIndex > 0) {
				setActivePromptIndex(activePromptIndex - 1);
				// updateListScroll();
			}
		}
		if (e.key === 'Enter' && showPromptsList && activePromptIndex > -1) {
			const option = promptsList[activePromptIndex];
			onSelect(option, '/');
			setShowPromptsList(false);
			setActivePromptIndex(0);
		}
		if (e.key === 'Backspace' && showPromptsList) {
			const temp = props.value.split('/');
			if (temp[temp.length - 1] === '') {
				setShowPromptsList(false);
			}
			setSearchText(temp[temp.length - 1]);
		}
	};
	useEffect(() => {
    if (list.current) {
      list.current.scrollTop = activePromptIndex * 30;
    }
  }, [activePromptIndex]);



	useEffect(() => {
		const temp = options.filter((option) => {
			return option.label.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
		})
		setPromptsList(temp);
		setActivePromptIndex(0);
	}, [options])


	const handleChange = (e) => {
		const { value } = e.target;

		if (value.trim === '' || promptsList.length === 0 || value === '/ ') {
			setShowPromptsList(false);
		}

		const match = value.match(/\/\w*$/);

		if (match) {
			setShowPromptsList(true);
		} else {
			setShowPromptsList(false);
		}

		if (showPromptsList) {
			// setSearchText to the text after the last /
			const temp = value.split('/');
			setSearchText(temp[temp.length - 1]);
		}
		onChange(value);
	}

	React.useEffect(() => {
		const temp = options.filter((option) => {
			return option.label.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
		})
		setPromptsList(temp);
	}, [searchText])

	return (
		<div>
			<textarea
				onChange={(e) => { handleChange(e) }}
				className='rounded-md bg-transparent w-full outline-none text-base scrollbar-custom max-h-40 h-10'
				// onKeyDown={(e) => { handleKeydown(e) }}
				value={props.value}
				placeholder={props.placeholder}
				onKeyDown={(e) => { handlePrefixKeyDown(e) }}
			/>
			{showPromptsList && promptsList.length > 0 && (
				<ul
					ref={list}
					className="absolute bottom-16 left-0 p-2 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto scrollbar-custom ">
					{promptsList.map((option, index) => {
						return <li
							className={`cursor-pointer hover:bg-gray-100 p-4 ${activePromptIndex === index ? 'bg-gray-200 active' : ''}`}
							onClick={() => {
								setShowPromptsList(false);
								onSelect(option, '/')
							}}
							key={index}>{option.label}</li>
					}
					)}
				</ul>
			)}
		</div>
	)
}
