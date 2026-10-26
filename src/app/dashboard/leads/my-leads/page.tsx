/*
|-----------------------------------------
| setting up Leads session-owned customers page
| @author: Codex
|-----------------------------------------
*/
import Query from "../_components/Query";
export default function Page() {
  return <Query kind="customers" mine />;
}
