import Dropzone from "react-dropzone"
import { useFormContext, Controller } from "react-hook-form"

interface Option {
  value: string
  label?: string
}

interface FormInputProps {
  name: string
  type?: "text" | "number" | "select" | "file" | "checkbox"
  placeholder?: string
  options?: Option[]
  prefix?: string
  step?: string
  rules?: object
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  type = "text",
  placeholder,
  options,
  prefix,
  step = "1",
  rules
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <div>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          switch (type) {
            case "text":
              return (
                <input
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  type="text"
                  id={name}
                  placeholder={placeholder}
                  className={`block w-full border p-2 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )

            case "number":
              return (
                <div className="relative">
                  {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500">
                      {prefix}
                    </span>
                  )}
                  <input
                    onBlur={onBlur}
                    value={value}
                    ref={ref}
                    type="number"
                    step={step}
                    id={name}
                    placeholder={placeholder}
                    className={`block w-full p-2 ${
                      prefix ? "pl-8" : ""
                    } border ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                    onChange={(e) =>
                      onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              )

            case "select":
              return (
                <select
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  id={name}
                  className={`block w-full border p-2 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select...</option>
                  {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label || option.value}
                    </option>
                  ))}
                </select>
              )

            case "file":
              return (
                <div className="flex flex-col items-center">
                  <Dropzone
                    onDrop={(acceptedFiles) => onChange(acceptedFiles)}
                    accept={{
                      "image/*": [".jpeg", ".jpg", ".png", ".gif"]
                    }}
                  >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <div
                        {...getRootProps()}
                        className={`w-[400px] shrink-0 rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                          isDragActive
                            ? "border-blue-500 bg-blue-100"
                            : "border-dashed border-gray-300 bg-teal-500"
                        }`}
                      >
                        <input {...getInputProps()} onBlur={onBlur} />
                        {isDragActive ? (
                          <p className="text-blue-700">Leave the image here</p>
                        ) : (
                          <div>
                            <p className="text-white">
                              Drag and drop laptop images
                              <br />
                              or
                            </p>
                            <div className="mx-auto mt-2 w-fit cursor-pointer rounded-lg bg-white px-4 py-2 text-teal-500 shadow-md transition-all duration-300 hover:bg-teal-500 hover:text-white">
                              Browse file
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                  {value && Array.isArray(value) && value.length > 0 && (
                    <div className="my-4 w-[400px]">
                      <h4 className="text-gray-700">Selected files:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {value.map((file: File) => (
                          <div
                            key={file.name}
                            className="relative overflow-hidden rounded-lg text-gray-600 shadow-lg"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="h-[200px] w-[200px] object-cover"
                            />
                            <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 text-center text-white">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )

            case "checkbox":
              return (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={name}
                    ref={ref}
                    checked={!!value} // Convertir el valor a booleano
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.checked)}
                    className={`mr-2 ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                  />
                  <label htmlFor={name}>{placeholder}</label>
                </div>
              )

            default:
              throw new Error(`Unsupported input type: ${type}`)
          }
        }}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  )
}

export default FormInput
