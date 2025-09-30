import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;        
  className?: string;         
}
export default function Container({ children, className = "" } : ContainerProps ) {
  return (
    <div className={`max-w-7xl w-11/12 mx-auto pb-16  ${className}`}>
      {children}
    </div>
  );
}
