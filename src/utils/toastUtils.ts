
import toast from 'react-hot-toast';

export const notifyError = (error: any) => {
    console.error("Error caught:", error);

    let errorMessage = "Something went wrong";

    if (error?.response) {
        // Axios error
        const data = error.response.data;
        errorMessage = data?.message || data?.error || error.message;

    } else if (error?.message) {
        // Standard JS Error
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    // You can customize the toast appearance here
    toast.error(errorMessage, {
        duration: 5000,
        style: {
            minWidth: '250px',
        },
    });
};

export const notifySuccess = (message: string) => {
    toast.success(message);
}
