import {useNavigation} from "react-router-dom";

const Button = ({
  className,
  children,
  onClick,
  type
}) => {
  const navigation = useNavigation();

  const isDisabled = navigation.state !== "idle"

  return (
    <button
      className={`text-lg bg-blue-800 disabled:bg-gray-600 text-white rounded-2xl p-2 min-w-24 ${className}`}
      onClick={onClick}
      type={type || "button"}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}

export default Button