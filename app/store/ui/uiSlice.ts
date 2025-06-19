import { sendRequest } from '../../config/compose';
import { INote } from '../../lib/ui.entities';
import { createAppSlice } from '../hooks';

interface IUIState {
  notes: INote[];
  hasNewNotes: boolean;
}

const initialState: IUIState = {
  notes: [],
  hasNewNotes: false,
};

export const uiSlice = createAppSlice({
  name: 'ui',
  initialState,
  reducers: (create) => ({
    loadNotes: create.asyncThunk(
      async (_, thunkAPI) => {
        const response = await sendRequest(
          'api/member/notifications',
          {},
          'GET',
        );
        if (!response.status) {
          throw new Error(response.message ?? 'Server error');
        }
        return response.data as INote[];
      },
      {
        fulfilled: (state, action) => {
          const hasNew = action.payload.some(
            (note) => !state.notes.some((x) => x.id === note.id),
          );
          state.notes = action.payload;
          state.hasNewNotes = state.hasNewNotes || hasNew;
        },
      },
    ),
    readNotes: create.reducer((state) => {
      state.hasNewNotes = false;
    }),
  }),
  selectors: {
    selectHasNew: (state) => state.hasNewNotes,
    selectNotes: (state) => state.notes,
  },
});

export const { loadNotes, readNotes } = uiSlice.actions;

export const { selectHasNew, selectNotes } = uiSlice.selectors;

export default uiSlice;
