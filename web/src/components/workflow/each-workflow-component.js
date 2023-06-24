// WorkflowComponent is a component that is used to display each component in the workflow

import VerticalLine from "./vertical-line";

// It is used in the workflow page
export const WorkFlowComponent = ({
  children,
  id,
  title,
  hasTop,
  hasBottom,
  isActive,
  ref,
}) => {
  return (
    <div className="flex flex-col gap-1.5 relative px-10" ref={ref}>
      {!isActive && (
        <div className="absolute bg-white bg-opacity-50 top-0 left-0 w-full h-full"></div>
      )}
      {/* header */}
      {hasTop && <VerticalLine />}
      <div className="flex gap-2.5 items-center">
        <div className="bg-black-50 flex justify-center items-center w-8 h-8 text-white rounded-full">
          <span>{id}</span>
        </div>
        <span className="text-base">{title}</span>
      </div>
      <VerticalLine />
      {children}
      {hasBottom && <VerticalLine />}
    </div>
  );
};
