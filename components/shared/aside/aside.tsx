import { AppVersion } from "../app-version";

const Aside = () => {
  return (
    <aside className="w-[17%] min-w-50 max-w-65 flex flex-col justify-between">
      Baranet
      <footer>
        <AppVersion />
      </footer>
    </aside>
  );
};

export default Aside;
