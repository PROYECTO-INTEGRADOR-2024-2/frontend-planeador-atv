import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function fechaAnterior(fecha) {
    const fechaFormateada = dayjs(fecha, 'YYYY-MM-DD hh:mm A');
    return fechaFormateada.isBefore(dayjs());
}