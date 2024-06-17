export const usersExists = (list, userEmail) => {
  const userExits = list.filter((user) => user.email === userEmail);
  return userExits.length > 0;
};

export const getTime = (timestamp, details = true) => {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const date = new Date(timestamp);
  const now = new Date();
  if (details) return date.toLocaleTimeString("en-US", options);
  function resetTime(date) {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const today = resetTime(new Date());
  const yesterday = resetTime(new Date(now.setDate(now.getDate() - 1)));

  if (date >= today) {
    return date.toLocaleTimeString("en-US", options);
  } else if (date >= yesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};
