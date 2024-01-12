import { imgPrefix } from "@/app/hooks/useImgPrefix";

interface TeamMemberProps {
    image: string;
    name: string;
    title: string;
    bio: string;
    url: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
    image, name, title, bio, url
}) => {
    return (
        <div className="grid gap-10 grid-cols-[300px_1fr]">
            <div className="w-full flex justify-end items-center">
                <div className="w-[150px] h-[150px]">
                    <a target="_blank" href={url} rel="noopener noreferrer">
                        <img
                            src={imgPrefix + image}
                            alt={`${name}, ${title}`}
                            className="cursor-pointer max-h-full max-w-full rounded-full"
                        />
                    </a>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold">{name}</h2>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p>{bio}</p>
            </div>
        </div>
    )
};

export default TeamMember;