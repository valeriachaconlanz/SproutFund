public class FormSubmission {

    private double budget;
    private int timeline;
    private String riskTolerance;

    public FormSubmission(double budget, int timeline, String riskTolerance) {
        this.budget = budget;
        this.timeline = timeline;
        this.riskTolerance = riskTolerance;
    }

    public double getBudget() {
        return budget;
    }

    public int getTimeline() {
        return timeline;
    }

    public String getRiskTolerance() {
        return riskTolerance;
    }

    public void setBudget(double budget) {
        this.budget = budget;
    }

    public void setTimeline(int timeline) {
        this.timeline = timeline;
    }

    public void setRiskTolerance(String riskTolerance) {
        this.riskTolerance = riskTolerance;
    }

    public void submitForm() {
        System.out.println("Form Successfully Submitted!");
        System.out.println("Budget: $" + budget);
        System.out.println("Timeline: " + timeline);
        System.out.println("Risk Tolerance: " + riskTolerance);
    }
    
    public void resultsRedirect() {
        System.out.println("Redirecting to investment results page...");
    }
}
