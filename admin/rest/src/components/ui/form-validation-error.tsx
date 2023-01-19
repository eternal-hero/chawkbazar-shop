interface Props {
  message: string | undefined;
}

const ValidationError = ({ message }: Props) => {
  return <p className="my-2 text-xs text-start text-red-500">{message}</p>;
};

export default ValidationError;
