import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ModelType } from '@/app/types/PlaygroundTypes';

const toggleButtonStyles = 'px-4 py-1 rounded-full transition-all duration-300 ease-in-out focus:outline-none';
const ProToggleButton = () => {
  const { modelType, updateModelType } = usePlaygroundStore();

  const toggleOption = (option: ModelType) => {
    console.log('option', option);
    updateModelType(option);
  };
  return (
    <div className="flex items-center justify-center border-b-2">
      <div className="flex bg-cambio-primary rounded-full p-1 text-md">
        <button
          className={`${modelType === ModelType.MINI ? 'bg-white text-black' : 'text-white'} ${toggleButtonStyles}`}
          onClick={() => toggleOption(ModelType.MINI)}
        >
          Mini
        </button>
        <button
          className={`${modelType === ModelType.PRO ? 'bg-white text-black' : 'text-white'} ${toggleButtonStyles}`}
          onClick={() => toggleOption(ModelType.PRO)}
        >
          Pro
        </button>
      </div>
    </div>
  );
};

export default ProToggleButton;
