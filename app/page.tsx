import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { loadDirectory } from "@/lib/content";

export default function DirectoryPage() {
  return (
    <main>
      <DirectoryExplorer entries={loadDirectory()} />
    </main>
  );
}
