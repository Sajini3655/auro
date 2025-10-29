const fetchData = async () => {
  setLoading(true);
  try {
    // Fetch cart items
    const cartRes = await fetch(`/api/cart/${encodeURIComponent(user.username)}`);
    let cartData = { items: [] };
    try {
      cartData = cartRes.ok ? await cartRes.json() : { items: [] };
    } catch (err) {
      console.warn("Cart API returned invalid JSON, using empty cart.", err);
      cartData = { items: [] };
    }
    setCart(cartData.items || []);

    // Fetch rewards
    const rewardsRes = await fetch(`/api/rewards/get?username=${encodeURIComponent(user.username)}`);
    let rewardsData = { points: 0, vouchers: [] };
    try {
      rewardsData = rewardsRes.ok ? await rewardsRes.json() : { points: 0, vouchers: [] };
    } catch (err) {
      console.warn("Rewards API returned invalid JSON, using defaults.", err);
      rewardsData = { points: 0, vouchers: [] };
    }
    setRewards(rewardsData || { points: 0, vouchers: [] });

    // Calculate total
    const cartTotal = (cartData.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(cartTotal);

  } catch (err) {
    console.error(err);
    setMessage("Failed to load cart or rewards.");
  } finally {
    setLoading(false);
  }
};
