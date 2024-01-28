import { postRequestHandler } from "./submit";
import toast from "react-hot-toast";

export const createProcess = async <T>(
  type: string,
  data?: object,
  autoComplete?: boolean,
  setError?: (error: Error) => unknown
) => {
  const result = await postRequestHandler<{
    process: {
      completion: string;
      type: string;
      ip: string;
      id: string;
    };
  }>(
    "/processes/create",
    {
      ...(data || {}),
      type: type,
    },
    undefined,
    setError
  );

  const promise = new Promise((resolve, reject) => {
    setTimeout(
      async () => {
        if (autoComplete) {
          const process = await postRequestHandler(
            "/processes/complete",
            {
              ...(data || {}),
              processId: result.data.process.id,
            },
            undefined,
            reject
		  );
			resolve(process.data);
		} else 
			resolve({})
      },
      new Date(result.data.process.completion).getTime() - Date.now()
    );
  });

  toast.promise(promise, {
	  	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	  loading: "Executing " + ((data as any).action || result.data.process.type ) + " on " +   result.data.process.ip + " completed in " + ((new Date(result.data.process.completion).getTime() - Date.now()) / 1000) + " seconds",
	  success:
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
      (autoComplete ? ("Successfully executed " + ((data as any).action || result.data.process.type ) +
      " on " +
      result.data.process.ip) : ("Awaiting completion...")),
    error:
      "Error executing " +
      result.data.process.type +
      " on " +
      result.data.process.ip,
  });

  return (await promise) as Promise<T>;
};
