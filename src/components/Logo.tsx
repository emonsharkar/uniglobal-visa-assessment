import logo from "@/assets/uniglobal-logo.png";

export const Logo = ({ className = "h-12" }: { className?: string }) => {
  return (
    <a 
      href="https://www.uniglobal.com.bd/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block"
    >
      <img 
        src={logo} 
        alt="UniGlobal" 
        className={className}
      />
    </a>
  );
};
