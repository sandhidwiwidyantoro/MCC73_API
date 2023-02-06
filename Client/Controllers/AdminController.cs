using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers;

[Authorize]
public class AdminController : Controller
{
	[Authorize(Roles = "Employee, Manager")]
	public IActionResult Table()
    {
        return View();
    }

    public IActionResult Dashboard()
    {
        return View();
    }
    public IActionResult Login()
    {
        return View();
    }
}
