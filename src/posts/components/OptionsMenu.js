import { useSelector } from "react-redux";
import styled from "styled-components";

const Panel = styled.div`
  position: absolute;
  min-width: 4rem;
  height: min-content;
  background-color: var(--panel);
  border-radius: 3px;
  box-shadow: 2px 4px 5px -5px black;
  bottom: 100%;
  left: 0;
  padding: 0.25rem;

  > ul {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Option = styled.li`
  list-style: none;
  font-size: 0.9rem;
  font-weight: normal;
  padding: 2px;
  border-radius: 2px;

  &:hover,
  &:focus {
    background-color: var(--bg);
  }
`;
const OptionsMenu = ({ editAction, deleteAction, author, mods }) => {
  const user = useSelector((state) => state.user);
  return (
    <Panel>
      <ul>
        {author === user.uid && <Option onClick={editAction}>Edit</Option>}

        {(mods.includes(user.uid) || author === user.uid) && (
          <Option onClick={deleteAction}>Delete</Option>
        )}

        <Option>Report</Option>
      </ul>
    </Panel>
  );
};

export default OptionsMenu;
