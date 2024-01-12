import { imgPrefix } from "@/app/hooks/useImgPrefix";
import Image from "next/image";

interface TeamMemberProps {
    image: string;
    name: string;
    title: string;
    bio?: string;
    url: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
    image, name, title, bio, url
}) => {
    return (
        <div className="col-span-1 h-[150px] w-full flex items-center justify-center">
            <div className="h-full grid gap-10 grid-cols-[150px_200px]">
                <div className="flex justify-center items-center">
                    <div className="w-[125px] h-[125px] overflow-hidden rounded-full">
                        <a target="_blank" href={url} rel="noopener noreferrer">
                            <Image
                                src={imgPrefix + image}
                                alt={`${name}, ${title}`}
                                className="cursor-pointer h-full w-full rounded-full hover:scale-110"
                                width="0"
                                height="0"
                            />
                        </a>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold">{name}</h2>
                    <h2 className="text-lg text-neutral-500">{title}</h2>
                    {bio &&
                        <p>{bio}</p>
                    }
                </div>
            </div>
        </div>
    )
};

export default TeamMember;