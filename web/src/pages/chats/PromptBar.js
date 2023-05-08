// functionality
// create a sidebar for the prompt page  --- DONE
// inside the sidebar, create a button that will allow the user to create a new prompt --- DONE
// after clicking the button, modal will pop up and ask the user to enter a prompt name, description, and main text --- DONE
// user can name use {{}} to create a variable that user can fill in later when they are creating a story --- DONE
// later when prompt seleted by user will be asked to fill the empty variables
import React, { useState } from "react";
import Modal from './Modal';
import {
	MdOutlineCreateNewFolder,
} from "react-icons/md";
import { AiOutlineCheck, AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { createPrompt, deletePrompt, updatePrompt } from "../../redux/actions/promptsActions";
import { HiPlus } from "react-icons/hi";
import { ToastContainer } from "react-toastify";
import { BiBulb } from "react-icons/bi";

function PromptBar({ open }) {
	const styles = {
		fileIconSize: "24px",
		iconSize: "20px",
	};
	const [showModal, setShowModal] = useState(false)
	const [showUpdateModal, setShowUpdateModal] = useState(false)
	const [updatePromptIndex, setUpdatePromptIndex] = useState(null)
	const [showerror, setShowerror] = useState(false)
	const [promptValues, setPromptValues] = useState({ name: '', description: '', content: '' })
	const [deletePromptIndex, setDeletePromptIndex] = useState(null)
	const dispatch = useDispatch();
	function handleValueChange(event) {
		const { name, value } = event.target;
		setPromptValues(prevValues => ({
			...prevValues,
			[name]: value
		}));
	}
	function handleFormSubmit(values) {
		if (!values.name || values.name === '') {
			return setShowerror(true)
		}

		dispatch(createPrompt({ ...values, id: prompts.length + 1 }))
		setShowModal(false)
		setPromptValues({ name: '', description: '', content: '' });
		setShowerror(false)
	}
	function handleDeletePrompt(index) {
		setDeletePromptIndex(index)
		dispatch(deletePrompt(deletePromptIndex))
		setDeletePromptIndex(null)
	}


	const prompts = useSelector(state => state.prompts);
	const [filteredPrompts, setFilteredPrompts] = useState(null)

	const handleUpdateFormSubmit = (values) => {
		if (values.name === '') {
			return setShowerror(true)
		}

		dispatch(updatePrompt({ ...values, id: updatePromptIndex }))
		setShowUpdateModal(false)
		setUpdatePromptIndex(null)
		setPromptValues({ name: '', description: '', content: '' });
		setShowerror(false)
	}

	const renderPrompt = (prompt, index) => (
		<li key={index}
			className="mr-4 p-2 text-lg hover:bg-hover-on-white cursor-pointer rounded-md grid grid-cols-[9fr_1fr] items-center mb-2 justify-between"
			onClick={() => {
				setUpdatePromptIndex(prompt.id)
				setPromptValues(prompt)
				setShowUpdateModal(true)
			}}
		>
			<div className="flex justify-start gap-4 items-center">
				<BiBulb size={styles.iconSize} />
				<h3 className="text-lg">{prompt.name}</h3>
			</div>
			<div className="flex justify-end gap-2 items-center">
				{
					deletePromptIndex === prompt.id ?
						<>
							<AiOutlineCheck
								size={styles.iconSize}
								onClick={(e) => {
									e.stopPropagation()
									handleDeletePrompt(prompt.id)
								}} />
							<AiOutlineClose
								size={styles.iconSize}
								onClick={(e) => {
									e.stopPropagation()
									setDeletePromptIndex(null)
								}} />
						</>
						:
						<AiOutlineDelete
							size={styles.iconSize}
							onClick={(e) => {
								e.stopPropagation()
								setDeletePromptIndex(prompt.id)
							}} />
				}
			</div>
		</li>
	)


	const handlePromptSearch = (e) => {
		const value = e.target.value.toLowerCase()

		const filtered = prompts.filter(prompt => {
			return prompt.name.toLowerCase().includes(value)
		})
		setFilteredPrompts(filtered)
	}


	return (
		<>
			<div className={`my-4 w-full text-center justify-between gap-2 ${!open ? 'd-none' : 'flex pr-4'} `}>
				<button
					className={`p-2 w-full hover:bg-light-gray border rounded-md flex items-center cursor-pointer gap-3  ${!open ? 'd-none' : 'flex'} `}
					onClick={() => setShowModal(true)}
				>
					<HiPlus size={styles.iconSize} />
					<span className="text-lg">New Prompt</span>
				</button>
				<button className="p-2 border hover:bg-light-gray rounded-md cursor-pointer flex justify-center items-center">
					<MdOutlineCreateNewFolder size={styles.fileIconSize} />
					{/* added the toast container here because had already developed layout without taking toast in consideration, toast container will be hidden */}
					<ToastContainer />
				</button>
			</div>

			{/* create modal */}
			<Modal
				centered
				closable={false}
				visible={showModal}
				okButtonProps={{ style: { backgroundColor: "#000" } }}
				onOk={(e) => handleFormSubmit(promptValues)}
				okText="Save"
				onCancel={() => {
					setShowerror(false)
					setShowModal(false)
					setPromptValues({ name: '', description: '', content: '' })
				}}
			>
				<ModalContent handleValueChange={handleValueChange} promptValues={promptValues} showerror={showerror} />
			</Modal>
			{/* update modal */}
			<Modal
				centered
				closable={false}
				visible={showUpdateModal}
				okButtonProps={{ style: { backgroundColor: "#000" } }}
				onOk={(e) => handleUpdateFormSubmit(promptValues)}
				okText="Save"
				onCancel={() => {
					setShowUpdateModal(false)
					setShowerror(false)
					setUpdatePromptIndex(null)
					setPromptValues({ name: '', description: '', content: '' })
				}}
			>
				<ModalContent handleValueChange={handleValueChange} promptValues={promptValues} showerror={showerror} />
			</Modal>

			<div className={`${!open || 'pr-4'}`}>
				<input
					className={`w-full p-3 border border-gray-300 rounded-md  ${!open ? 'd-none' : 'flex'} `}
					placeholder="Search prompt"
					onChange={handlePromptSearch}
				/>
				<hr className="h-px bg-gray-300 mt-3 border-0"></hr>
			</div>
			<ul className={`overflow-y-auto  ${!open && 'd-none'}  mt-3`} style={{ maxHeight: '67vh' }}>
				{(filteredPrompts && filteredPrompts !== []) ? filteredPrompts.map((prompt, index) => renderPrompt(prompt, index)) : prompts.map((prompt, index) => renderPrompt(prompt, index))}
			</ul >
		</>
	)
}

export default PromptBar;


const ModalContent = ({ handleValueChange, promptValues, showerror }) => {
	return (
		<form className="flex flex-col w-full gap-4">
			<div className="flex flex-col w-ful gap-2">
				<label className="font-medium text-gray-700 text-base">Name</label>
				<input
					placeholder="Name of the prompt"
					className="p-2 border border-[#CED0D4] rounded-md bg-transparent"
					type="input" name="name" value={promptValues.name}
					onChange={handleValueChange}
				/>
				<p className={`mt-1 ${showerror ? 'block' : 'd-none'} text-pink-600 text-sm`}>
					Please provide a name for prompt.
				</p>
			</div>
			<div className="flex flex-col w-ful gap-2">
				<label className="font-medium text-gray-700 text-base">Description</label>
				<textarea
					name={'description'}
					placeholder="A short description of the prompt"
					className="p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none"
					value={promptValues.description}
					rows={4}
					onChange={handleValueChange}
				/>
			</div>
			<div className="flex flex-col w-ful gap-2">
				<label className="font-medium text-gray-700 text-base">Prompt</label>
				<textarea
					placeholder="Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}"
					name={'content'}
					className="p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none"
					value={promptValues.content}
					rows={10}
					onChange={handleValueChange}
				/>
			</div>
		</form>
	)
}
