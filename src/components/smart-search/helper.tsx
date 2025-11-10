import { Box, Card, Container, Typography } from "@mui/material";

export const SmartSearchHelper = () => {
    return (
        <Container maxWidth="md" sx={{ mb: 6 }}>
            <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    איך להשתמש בחיפוש החכם
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    הזינו טקסט חופשי ולחצו על כפתור "חיפוש" כדי לראות תוצאות.
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    דוגמאות שאפשר לנסות:
                </Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    <li>
                        <Typography variant="body2">"מכונית עד 5000 ש"ח" — מציג קבוצות פעילות עד מחיר זה ובקשות רלוונטיות.</Typography>
                    </li>
                    <li>
                        <Typography variant="body2">"אוזניות ביטול רעשים" — חיפוש לפי שם מוצר/קטגוריה/תיאור.</Typography>
                    </li>
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    מה יוצג לאחר חיפוש?
                </Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    <li>
                        <Typography variant="body2">קבוצות פעילות רלוונטיות בצד שמאל.</Typography>
                    </li>
                    <li>
                        <Typography variant="body2">בקשות רלוונטיות בצד ימין.</Typography>
                    </li>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    טיפ: ניתן גם ללחוץ Enter כדי לבצע חיפוש.
                </Typography>
            </Card>
        </Container>
    );
};
