import {render, screen, waitFor} from '@testing-library/react'
import ProjectsPage from '@/app/(dashboard)/projects/[id]/page'

describe("Testing Home Page", () => {
    test("Testing Home Page", async () => {
        const project_id = "a273da34-7038-4ff6-b140-1317f8dc743d";

        render(<ProjectsPage params={{id: project_id}} />);

        await waitFor(() => {
            const pageElement = screen.getByAltText('Projects');
            expect(pageElement).toBeInTheDocument();
        });
    });
});
