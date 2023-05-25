export default function PersonaCard({ name, desc, image }) {
  return (
    <div className="flex flex-col justify-between w-48 h-72 rounded-[12px] bg-white-30 px-[21px] py-[17px]">
      <img src={image} />
      <h2 className="text-[20px] font-[600] text-black-60">{name}</h2>
      <p className="text-[14px] font-[400] text-black-25">{desc}</p>
    </div>
  );
}
