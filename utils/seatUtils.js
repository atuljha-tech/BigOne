// utils/seatUtils.js

/**
 * Generates a seat object from drawing tool metadata.
 * Used when organizer creates the seat layout.
 */
export function generateSeat(seatNumber, price, x, y, width, height) {
  return {
    seatNumber,
    price,
    position: { x, y },
    size: { width, height },
    status: "available", // available | booked | blocked
  };
}

/**
 * Generates a full seat grid (optional helper)
 * Example: rows = 5, cols = 10, start seat from A1
 */
export function generateSeatGrid(rows, cols, basePrice = 200) {
  const seats = [];
  let rowChar = 65; // 'A'

  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const seatNumber = String.fromCharCode(rowChar + r) + c;
      seats.push(
        generateSeat(seatNumber, basePrice, 0, 0, 40, 40) // default size
      );
    }
  }

  return seats;
}

/**
 * Returns seat object by number
 */
export function findSeat(seatMap, seatNumber) {
  return seatMap.find((s) => s.seatNumber === seatNumber);
}

/**
 * Checks if seat is available
 */
export function isSeatAvailable(seatMap, seatNumber) {
  const seat = findSeat(seatMap, seatNumber);
  return seat && seat.status === "available";
}

/**
 * Marks multiple seats as booked
 * Useful after payment success
 */
export function markSeatsBooked(seatMap, selectedSeats) {
  const updated = seatMap.map((seat) => {
    if (selectedSeats.includes(seat.seatNumber)) {
      return { ...seat, status: "booked" };
    }
    return seat;
  });
  return updated;
}

/**
 * Get the total price for selected seats
 */
export function calculateTotal(seatMap, selectedSeats) {
  return selectedSeats.reduce((total, seatNumber) => {
    const seat = seatMap.find((s) => s.seatNumber === seatNumber);
    return seat ? total + seat.price : total;
  }, 0);
}

/**
 * Color code seats based on status
 * UI helper → used in SeatViewer & SeatBooking
 */
export function getSeatColor(status) {
  switch (status) {
    case "available":
      return "green";
    case "booked":
      return "red";
    case "selected":
      return "yellow";
    default:
      return "gray";
  }
}
