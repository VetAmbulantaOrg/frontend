import AxiosConfig from "./AxiosConfig.js";

export async function getAppointmentsByMonth(fetchData) {
    const response = await AxiosConfig.post(`/Appointments/vet/${fetchData.vetId}/monthly/` , fetchData);
    return response.data;
}

export async function createAppointment(appointmentData) {
const response = await AxiosConfig.post("/Appointments/", appointmentData);
return response.data;
}

export async function cancelAppointment(cancellationData) {
const reponse = await AxiosConfig.put(`/Appointments/${cancellationData.appointmentId}/cancel/`, cancellationData );
return reponse.data;
}