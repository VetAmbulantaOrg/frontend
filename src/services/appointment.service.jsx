import AxiosConfig from "./AxiosConfig.js";

export async function getAppointmentsByMonth(vetId) {
    const response = await AxiosConfig.get(`/Appointments/vet/${vetId}/monthly/`);
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