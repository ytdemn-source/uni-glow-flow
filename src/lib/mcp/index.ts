import { defineMcp } from "@lovable.dev/mcp-js";
import listNotesTool from "./tools/list-notes";
import searchNotesTool from "./tools/search-notes";
import listAnnouncementsTool from "./tools/list-announcements";

export default defineMcp({
  name: "a-help-deck-mcp",
  title: "A Help Deck",
  version: "0.1.0",
  instructions:
    "Tools for A Help Deck — a student helper. Use `list_notes` and `search_notes` to browse published study notes, and `list_announcements` to fetch recent broadcasts.",
  tools: [listNotesTool, searchNotesTool, listAnnouncementsTool],
});
