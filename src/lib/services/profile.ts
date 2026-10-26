/* profile service */
import "server-only";
import { findProfileUser, saveProfileUser } from "@/lib/models/auth";
const genders = new Set(["", "Male", "Female", "Other"]);
export async function getProfile(
  id: string,
  email?: string | null,
  sessionName?: string | null,
  sessionImage?: string | null,
) {
  const user = await findProfileUser(id, email);
  return {
    name: user?.name ?? sessionName ?? "",
    email: user?.email ?? email ?? "",
    mobileNumber: user?.mobileNumber ?? "",
    address: user?.address ?? "",
    bio: user?.bio ?? "",
    profilePicture: user?.profilePicture ?? sessionImage ?? "",
    gender: user && genders.has(user.gender ?? "") ? user.gender : "",
  };
}
export const validGender = (value: string) => genders.has(value);
export const saveProfile = (id: string, email: string | null | undefined, profile: Record<string, unknown>) =>
  saveProfileUser(id, email, profile);
