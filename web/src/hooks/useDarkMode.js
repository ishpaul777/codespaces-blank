import { useDispatch, useSelector } from "react-redux";

const useDarkMode = () => {
  const darkMode = useSelector((state) => state.darkMode);
  const dispatch = useDispatch()
  const toggleDarkMode = () => {
    dispatch({
      type: 'TOGGLE_DARK_MODE',
      payload: !darkMode
    })

    localStorage.setItem('darkMode', !darkMode);
  }
  return {
    darkMode,
    toggleDarkMode,
  }
}

export default useDarkMode;
