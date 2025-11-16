import logo from "@/assets/uniglobal-logo.png";

export const Logo = ({ className = "h-12" }: { className?: string }) => {
  return (
    <img 
      src={logo} 
      alt="UniGlobal" 
      className={className}
    />
  );
};
