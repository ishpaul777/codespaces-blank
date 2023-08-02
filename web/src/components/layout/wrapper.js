// Wrapper component wraps up the main content of the page
function Wrapper({ children }) {
  return <div className={`my-16 mx-10`}>{children}</div>;
}

export default Wrapper;
