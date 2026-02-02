import { Bell, MessageCircleQuestionMark, Settings } from "lucide-react";
import ActionItem from "./components/action-item";
import SearchInput from "./components/search-input";

const SearchHeader = () => {
  return (
    <div className="flex items-center justify-between gap-6">
      {/* Search */}
      <div className="w-full">
        <SearchInput id="search-bar" placeholder="Pesquisar" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <ActionItem icon={Bell} label="Notificações" />
        <ActionItem icon={MessageCircleQuestionMark} label="Ajuda" />
        <ActionItem icon={Settings} label="Configurações" />
      </div>
    </div>
  );
};

export default SearchHeader;
