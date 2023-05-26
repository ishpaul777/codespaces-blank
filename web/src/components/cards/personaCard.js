export default function PersonaCard({ name, desc, image }) {
  const maxDescriptionLength = 60;
  return (
    <div className="flex flex-col justify-between w-full rounded-lg bg-white-30 px-[20px] py-[16px] cursor-pointer ">
      <div className="h-[60%]">
        <img src={image} className="w-full h-full rounded-lg" />
      </div>
      <h2 className="text-[20px] font-[600] text-black-60">{name}</h2>
      <p className="text-[14px] font-[400] text-black-25">
        {desc?.length > maxDescriptionLength
          ? `${desc?.slice(0, maxDescriptionLength)}...`
          : desc}
      </p>
    </div>
  );
}
