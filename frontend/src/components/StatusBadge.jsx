const COLORS = {
  unresolved: '#e74c3c',
  resolved: '#27ae60',
  archived: '#95a5a6',
};

export default function StatusBadge({ status }) {
  return (
    <span
      style={{
        background: COLORS[status] || '#7f8c8d',
        color: 'white',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '0.8rem',
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  );
}
