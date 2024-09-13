import { useRouter } from 'next/navigation';
import Button from '../Button';

const SuccessDisplay = () => {
  const router = useRouter();

  return (
    <div className="h-[80vh] w-full flex flex-col gap-5 items-center justify-center">
      <h1 className="text-6xl font-semibold">Successfully Subscribed!</h1>
      <h2 className="text-3xl text-neutral-500 pb-10">{`You're all set to start parsing your data 🚀`}</h2>
      <div className="w-fit flex flex-row items-center justify-center gap-10">
        <div className="w-[300px]">
          <Button label="Go to Account" onClick={() => router.push('/account')} small outline />
        </div>
      </div>
    </div>
  );
};

export default SuccessDisplay;
