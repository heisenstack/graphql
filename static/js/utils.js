function formatting(exp) {
  const absExp = Math.abs(exp);
  const sign = exp < 0 ? "-" : "";

  if (absExp < 1000) {
    return sign + Math.round(absExp).toFixed(2) + " b";
  } else if (absExp < 1000000) {
    return sign + Math.round(absExp / 1000) + " kb";
  } else {
    return sign + (absExp / 1000000).toFixed(2) + " mb";
  }
}

function totalXp(arr) {
  return arr.reduce((total, transaction) => total + transaction.amount, 0);
}

export { formatting, totalXp };
