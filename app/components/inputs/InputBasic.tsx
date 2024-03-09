'use client';

interface InputBasicProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error: string;
}

const InputBasic = ({ label, value, onChange, error }: InputBasicProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <div className="w-full relative">
      <input
        placeholder=" "
        className={`
          peer
          w-full
          p-4
          pt-6
          font-light
          bg-white
          border-2
          rounded-md
          outline-none
          transition
          ${error.length > 0 ? 'focus:border-rose-500' : 'focus:border-neutral-500'}
        `}
        onChange={handleChange}
        value={value}
      />
      <label
        className={`
          absolute
          text-md
          duration-150
          transform
          -translate-y-3
          left-5
          top-5
          z-10
          origin-[0]
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          text-zinc-400
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default InputBasic;
