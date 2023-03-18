export const calculatePoints = (data) => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      const {adminstars, count } = data[i];
      const points = adminstars* (count || 1);
      total += points;
    }
    return total;
  };
  