export const calculatePoints = (data) => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      const { stars, multiple } = data[i];
      const points = stars * (multiple || 1);
      total += points;
    }
    return total;
  };
  