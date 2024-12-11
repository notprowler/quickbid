import supabase from "@/config/database";

export const checkVIPStatus = async (userId: number) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("balance, suspension_count, vip, role, status")
    .eq("user_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return false;
  }

  const isVIP =
    user.balance > 5000 &&
    user.suspension_count === 0 &&
    user.vip === true &&
    user.role !== "suspended";

  return isVIP;
};

export const applyVIPDiscount = (amount: number) => {
  const discount = 0.1; // 10% discount
  return amount * (1 - discount);
};

export const demoteVIP = async (userId: number) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("balance, suspension_count, vip, role, status")
    .eq("user_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return;
  }

  const isVIP =
    user.balance > 5000 &&
    user.suspension_count === 0 &&
    user.vip === true &&
    user.role !== "suspended";

  if (!isVIP) {
    const { error: updateError } = await supabase
      .from("users")
      .update({ vip: false })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error demoting VIP user:", updateError);
    }
  }
};