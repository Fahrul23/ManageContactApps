const Badge = ({
  variant = 'male',
  label
}) => {
  const isWoman = variant === 'female';
  return <span style={{
    display: 'inline-block',
    background: isWoman ? '#ffd9e4' : '#d3e4fe',
    color: isWoman ? '#8c0053' : '#464554',
    padding: '2px 12px',
    borderRadius: '9999px',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.05em',
    fontWeight: 600
  }}>
      {label || (isWoman ? 'Wanita' : 'Pria')}
    </span>;
};
export default Badge;